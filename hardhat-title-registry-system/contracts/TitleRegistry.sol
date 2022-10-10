// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
error TitlRegistry__PriceMustBeAboveZero();
error TitleRegistry__NotApprovedForSystem();
error TitlRegistry__AlreadyListed(address titleAddress, uint256 tokenId);
error TittleRegistry__NotOwner();
error TitlRegistry__NotListed(address titleAddress, uint256 tokenId);
error TitlRegistry__PriceNotMet(
    address titleAddress,
    uint256 tokenId,
    uint256 price
);

contract TitlRegistry {
    struct Listing {
        uint256 price;
        address seller;
    }

    event TitleListed(
        address indexed seller,
        address indexed titleAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    // Listado de las direcciones (ethereum) de los titulos -> TokenID Titulo -> Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    // Direccion (etherem) del vendedor -> Cantidad recolectada
    mapping(address => uint256) private s_proceeds;

    //Modifiers
    modifier notListed(
        address titleAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[titleAddress][tokenId];
        if (listing.price > 0) {
            revert TitlRegistry__AlreadyListed(titleAddress, tokenId);
        }
        _;
    }

    modifier isListed(address titleAddress, uint256 tokenId) {
        Listing memory listing = s_listings[titleAddress][tokenId];

        if (listing.price <= 0) {
            revert TitlRegistry__NotListed(titleAddress, tokenId);
        }
        _;
    }
    modifier isOwner(
        address titleAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 title = IERC721(titleAddress);
        address owner = title.ownerOf(tokenId);
        if (spender != owner) {
            revert TittleRegistry__NotOwner();
        }
        _;
    }

    // Main functions

    /* @notice Metodo para listar los titulos de propiedad en el sistema
     * @param titleAddress: Direccion (ethereum) del titulo
     * @param tokenId: El token identificador del titulo
     * @param price: El precio de venta del titulo de la propiedad listada
     * @dev Tecnicamente, se podria utilizar el contrato como una cuenta de retencion para el titulo
     * pero de esta manera el dueño puede mantener su titulo mientras se encuentra listado
     */

    function listTitle(
        address titleAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(titleAddress, tokenId, msg.sender)
        isOwner(titleAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert TitlRegistry__PriceMustBeAboveZero();
        }

        // 1. Enviar el titulo de propiedad al contrato. Tranferencia -> Contrato "mantener" el titulo.
        // 2. Los dueños pueden mantener su titulo, y dar aprovacion al sistema para la venta del titulo
        // por ellos.

        IERC721 title = IERC721(titleAddress);
        if (title.getApproved(tokenId) != address(this)) {
            revert TitleRegistry__NotApprovedForSystem();
        }
        s_listings[titleAddress][tokenId] = Listing(price, msg.sender);
        emit TitleListed(msg.sender, titleAddress, tokenId, price);
    }

    function buyTitle(address titleAddress, uint256 tokenId)
        external
        payable
        isListed(titleAddress, tokenId)
    {
        Listing memory listedTitle = s_listings[titleAddress][tokenId];

        if (msg.value < listedTitle.price) {
            revert TitlRegistry__PriceNotMet(
                titleAddress,
                tokenId,
                listedTitle.price
            );
        }
        // No se le envía directamente el dinero al vendedor
        // https://github.com/fravoll/solidity-patterns/blob/master/docs/pull_over_push.md
        s_proceeds[listedTitle.seller] =
            s_proceeds[listedTitle.seller] +
            msg.value;
        delete (s_listings[titleAddress][tokenId]);
        IERC721(titleAddress).transferFrom(
            listedTitle.seller,
            msg.sender,
            tokenId
        );
    }
}

// 1. `listTitle`: Listar los titulos de propiedad en el sistema de registro
// 2. `buyTitle`: Comprar un titulo de propiedad
// 3. `cancelTitle`: Cancela el listado de un titulo de propiedad
// 4. `updateListing`: Actualiza la información de un titulo de propiedad
// 5. `withdrawProceeds`: Retirar el pago cuando una venta se complete exitosamente
