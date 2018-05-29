// @flow
import * as React from 'react';

export type Header = {
  // El nombre de la propiedad de un item que se va a desplegar en la columna del header
  key: string,
  // El título que debe de salir en el header de la tabla
  text: string,
  parser?: (v: any) => any,
};

export type ItemAvailableAction = {
  // La llave de la acción (para obtener la función de 'onSingleItemActions')
  key: string,
  // La acción estará disponible o no (sí es visible)
  available: boolean,
}

export type Item = { // Cada item es un objeto que requiere tener una llave 'actions'
  id: number | string,
  actions?: ItemAvailableAction[],

  [key: string]: any,
};

export type SingleItemActions = { // Un json en el cual cada propiedad debe tener 'text' y 'func'
  [key: string]: { // El key es el mismo que en 'Item.actions'
    Component: React.ComponentType<*>, // Botón a mostrar
    componentProps: { [key: string]: any }, // Botón a mostrar
    func: Function, // Función onClick, como único parametro siempre se envía el item completo
  },
};

export type MultipleItemsActions = {
  available: boolean, // La acción estará disponible para todos los seleccionados
  text: string, // Texto a mostrar en el objeto button
  func: Function, // Función onClick, como único parametro se envía la lista de items completa
};
