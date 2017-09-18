// @flow
export type Header = {
  // El nombre de la propiedad de un item que se va a desplegar en la columna del header
  key: string,
  // El título que debe de salir en el header de la tabla
  text: string,
};

export type Item = { // Cada item es un objeto que requiere tener una llave 'actions'
  actions: Array<{
    // La llave de la acción (para obtener la función de 'onSingleItemActions')
    key: string,
    // La acción estará disponible o no (sí es visible)
    available: boolean,
  }>,
} & Object;

export type SingleItemActions = { // Un json en el cual cada propiedad debe tener 'text' y 'func'
  [key: string]: { // El key es el mismo que en 'Item.actions'
    text: string, // Texto a mostrar en el objeto button
    func: Function, // Función onClick, como único parametro siempre se envía el item completo
  },
};

export type MultipleItemsActions = Array<{
  available: boolean, // La acción estará disponible para todos los seleccionados
  text: string, // Texto a mostrar en el objeto button
  func: Function, // Función onClick, como único parametro se envía la lista de items completa
}>;
