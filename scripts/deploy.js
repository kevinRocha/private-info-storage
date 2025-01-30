const hre = require("hardhat");

async function main() {
  // Obtenemos el contrato para desplegar
  const PrivateInfoStorage = await hre.ethers.getContractFactory("PrivateInfoStorage");

  // Desplegamos el contrato
  const privateInfoStorage = await PrivateInfoStorage.deploy();

  // Esperamos a que el contrato sea desplegado
  await privateInfoStorage.deployed();

  // Mostramos la direccion del contrato desplegado
  console.log("PrivateInfoStorage desplegado en:", privateInfoStorage.address);
}

// Ejecutamos la funcion main y manejamos errores
main()
  .then(() => process.exit(0)) // Salimos con codigo 0 (exito)
  .catch((error) => {
    console.error(error); // Mostramos el error en la consola
    process.exit(1); // Salimos con codigo 1 (error)
  });