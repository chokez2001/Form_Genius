import { Storage } from '@ionic/storage';

const storage = new Storage();

storage.create();

const guardarFormulario = async (formulario: any) => {
  try {
    const formulariosVaciosJSON = await storage.get('formulariosVacios');
    const formulariosLlenosJSON = await storage.get('formulariosLlenos');
    const formulariosIdsJSON = await storage.get('formulariosIds');

    let formulariosVacios = formulariosVaciosJSON ? JSON.parse(formulariosVaciosJSON) : [];
    let formulariosLlenos = formulariosLlenosJSON ? JSON.parse(formulariosLlenosJSON) : [];
    let formulariosIds = formulariosIdsJSON ? JSON.parse(formulariosIdsJSON) : [];

    const tipo = formulario.Tipo;
    const nombre = formulario.Nombre;
    const formularioId = tipo === "Vacio" ? `P${formulariosIds.length + 1}` : `H${formulariosIds.length + 1}`;

    if (tipo === "Vacio") {
      if (formulariosVacios.some((form: any) => form.Nombre === nombre)) {
        console.error('Ya existe un formulario vacío con el mismo nombre');
        return;
      }
      formulariosVacios.push({ ...formulario, Id: formularioId });
    } else if (tipo === "Lleno") {
      const formularioPadre = formulario.Fomulario_padre;
      if (formularioPadre && !formulariosVacios.some((form: any) => form.Id === formularioPadre)) {
        console.error('No se encontró el formulario vacío padre');
        return;
      }
      if (formulariosLlenos.some((form: any) => form.Nombre === nombre)) {
        console.error('Ya existe un formulario lleno con el mismo nombre');
        return;
      }
      formulariosLlenos.push({ ...formulario, Id: formularioId });
    } else {
      console.error('Tipo de formulario inválido');
      return;
    }

    formulariosIds.push(formularioId);

    await storage.set('formulariosVacios', JSON.stringify(formulariosVacios));
    await storage.set('formulariosLlenos', JSON.stringify(formulariosLlenos));
    await storage.set('formulariosIds', JSON.stringify(formulariosIds));

    console.log('Formulario guardado exitosamente');
  } catch (error) {
    console.error('Error al guardar el formulario:', error);
  }
};




const obtenerFormulario = async (formularioId: string) => {
  try {
    const formularioJSON = await storage.get(formularioId);
    if (formularioJSON) {
      return JSON.parse(formularioJSON);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el formulario:', error);
    return null;
  }
};


const actualizarFormulario = async (formularioId: string, formularioActualizado: any) => {
  const formularioExistente = await obtenerFormulario(formularioId);
  if (formularioExistente) {
    const formularioActualizadoJSON = JSON.stringify(formularioActualizado);
    return storage.set(formularioId, formularioActualizadoJSON);
  } else {
    return null;
  }
};

const eliminarFormulario = (formularioId: string) => {
  return storage.remove(formularioId);
};

export { guardarFormulario, obtenerFormulario, actualizarFormulario, eliminarFormulario };