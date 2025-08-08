export default (sequelize, DataTypes) => {
  const Organizacion = sequelize.define('Organizacion', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dominio: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true
    },
    consultas_mes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    problemas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'organizaciones',
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Organizacion;
};
