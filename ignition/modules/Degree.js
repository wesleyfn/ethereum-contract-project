const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DegreeModule = buildModule("DegreeModule", (m) => {
  const degree = m.contract("DegreeStorage");

  return { degree };
});

module.exports = DegreeModule;