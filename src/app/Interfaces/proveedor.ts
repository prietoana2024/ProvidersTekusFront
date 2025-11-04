
export interface Proveedor {
       id: number,
      nombreCampo: string,
      etiqueta:string,
      tipoDato: string,
      requerido: boolean,
      orden: number,
      activo: boolean,
      fechaCreacion: string,
      proveedorCamposValores: []
    }