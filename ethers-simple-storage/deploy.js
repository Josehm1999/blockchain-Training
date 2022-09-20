function hi() {
  console.log('hi')
  let variable = 5
  console.log(variable)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(error)
    process.exit(1)
  })
