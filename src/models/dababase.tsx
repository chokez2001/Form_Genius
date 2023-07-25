import { Storage } from '@ionic/storage';

const storage = new Storage();

storage.create();


const guardarFormularioVacio = async (formulario: any) => {
  try {
    const formulariosVaciosJSON = await storage.get('formulariosVacios');
    let formulariosVacios = formulariosVaciosJSON ? JSON.parse(formulariosVaciosJSON) : [];

    const nombre = formulario.Nombre;
    const formularioId = `P${formulariosVacios.length + 1}`;

    if (formulariosVacios.some((form: any) => form.Nombre === nombre)) {
      console.error('Ya existe un formulario vacío con el mismo nombre');
      return;
    }

    formulariosVacios.push({ ...formulario, Id: formularioId });

    await storage.set('formulariosVacios', JSON.stringify(formulariosVacios));

    console.log('Formulario vacío guardado exitosamente');
  } catch (error) {
    console.error('Error al guardar el formulario vacío:', error);
  }
};






const guardarFormularioLleno = async (formulario: { Nombre: any; id_padre: any; }) => {
  try {
    const formulariosVaciosJSON = await storage.get('formulariosVacios');
    const formulariosLlenosJSON = await storage.get('formulariosLlenos');

    let formulariosVacios = formulariosVaciosJSON ? JSON.parse(formulariosVaciosJSON) : [];
    let formulariosLlenos = formulariosLlenosJSON ? JSON.parse(formulariosLlenosJSON) : [];

    const nombre = formulario.Nombre;
    const id_padre = formulario.id_padre;
    const formularioId = `H${formulariosLlenos.length + 1}`;

    if (id_padre && !formulariosVacios.some((form: { Id: any; }) => form.Id === id_padre)) {
      console.error('No se encontró el formulario vacío padre');
      return;
    }

    if (formulariosLlenos.some((form: { Nombre: any; }) => form.Nombre === nombre)) {
      console.error('Ya existe un formulario lleno con el mismo nombre');
      return;
    }

    formulariosLlenos.push({ ...formulario, Id: formularioId });

    await storage.set('formulariosLlenos', JSON.stringify(formulariosLlenos));

    console.log('Formulario lleno guardado exitosamente');
  } catch (error) {
    console.error('Error al guardar el formulario lleno:', error);
  }
};


const obtenerFormulariosVacios = async () => {
  try {
    const formulariosVaciosJSON = await storage.get('formulariosVacios');
    if (formulariosVaciosJSON) {
      const formulariosVacios = JSON.parse(formulariosVaciosJSON) as any[];
      return formulariosVacios;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al obtener los formularios vacíos:', error);
    throw error;
  }
};

const obtenerFormulariosLlenos = async () => {
  try {
    const formulariosLlenosJSON = await storage.get('formulariosLlenos');
    if (formulariosLlenosJSON) {
      const formulariosLlenos = JSON.parse(formulariosLlenosJSON) as any[];
      return formulariosLlenos;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al obtener los formularios Llenos:', error);
    throw error;
  }
};




// Obtener el formulario vacío específico según el ID proporcionado
const obtenerFormularioVacioPorID = async (formularioID: string) => {
  try {
    const formulariosVaciosJSON = await storage.get('formulariosVacios');
    if (formulariosVaciosJSON) {
      const formulariosVacios = JSON.parse(formulariosVaciosJSON) as any[];
      const formulario = formulariosVacios.find((form) => form.Id === formularioID);
      return formulario || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el formulario vacío:', error);
    throw error;
  }
};









const editarFormularioVacio = async (formularioId: string, nuevoFormulario: any) => {
  try {
    const formulariosVaciosJSON = await storage.get('formulariosVacios');
    let formulariosVacios = formulariosVaciosJSON ? JSON.parse(formulariosVaciosJSON) : [];

    const formularioIndex = formulariosVacios.findIndex((form: any) => form.Id === formularioId);

    if (formularioIndex === -1) {
      console.error('No se encontró el formulario vacío con el ID especificado');
      return;
    }

    formulariosVacios[formularioIndex] = { ...nuevoFormulario, Id: formularioId };

    await storage.set('formulariosVacios', JSON.stringify(formulariosVacios));

    console.log('Formulario vacío editado exitosamente');
  } catch (error) {
    console.error('Error al editar el formulario vacío:', error);
  }
};


const borrarFormularioVacio = async (formularioId: string) => {
  try {
    const formulariosVaciosJSON = await storage.get('formulariosVacios');
    let formulariosVacios = formulariosVaciosJSON ? JSON.parse(formulariosVaciosJSON) : [];

    formulariosVacios = formulariosVacios.filter((formulario: any) => formulario.Id !== formularioId);

    await storage.set('formulariosVacios', JSON.stringify(formulariosVacios));

    console.log('Formulario vacío borrado exitosamente');
  } catch (error) {
    console.error('Error al borrar el formulario vacío:', error);
  }
};


export { guardarFormularioLleno, obtenerFormularioVacioPorID, obtenerFormulariosVacios, obtenerFormulariosLlenos, guardarFormularioVacio, editarFormularioVacio, borrarFormularioVacio};
