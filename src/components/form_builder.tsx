import React, { useState } from 'react';
import {
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonCheckbox,
  IonList,
} from '@ionic/react';

interface Field {
  id: number;
  type: string;
  label: string;
  options?: string[];
}

const FormBuilder: React.FC = () => {
  const [formTitle, setFormTitle] = useState('Mi formulario');
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldType, setSelectedFieldType] = useState('');

  const handleTitleChange = (event: CustomEvent<InputChangeEventDetail>) => {
    setFormTitle(event.detail.value!);
  };

  const handleFieldLabelChange = (id: number, label: string) => {
    const updatedFields = fields.map((field) => {
      if (field.id === id) {
        return {
          ...field,
          label,
        };
      }
      return field;
    });

    setFields(updatedFields);
  };

  const handleCheckboxOptionChange = (
    id: number,
    optionIndex: number,
    optionValue: string,
  ) => {
    const updatedFields = fields.map((field) => {
      if (field.id === id && field.type === 'checkbox') {
        const updatedOptions = [...field.options!];
        updatedOptions[optionIndex] = optionValue;

        return {
          ...field,
          options: updatedOptions,
        };
      }
      return field;
    });

    setFields(updatedFields);
  };

  const handleFieldTypeChange = (event: CustomEvent<any>) => {
    const fieldType = event.detail.value;
    setSelectedFieldType(fieldType);

    const newField: Field = {
      id: Date.now(),
      type: fieldType,
      label: '',
      options: [],
    };

    setFields([...fields, newField]);
  };

  const handleAddOption = (id: number) => {
    const updatedFields = fields.map((field) => {
      if (field.id === id) {
        const updatedOptions = [...field.options!, ''];
        return {
          ...field,
          options: updatedOptions,
        };
      }
      return field;
    });

    setFields(updatedFields);
  };

  const handleRemoveOption = (id: number, optionIndex: number) => {
    const updatedFields = fields.map((field) => {
      if (field.id === id) {
        const updatedOptions = field.options!.filter(
          (_, index) => index !== optionIndex,
        );
        return {
          ...field,
          options: updatedOptions,
        };
      }
      return field;
    });

    setFields(updatedFields);
  };

  const renderFieldInputs = (field: Field) => {
    switch (field.type) {
      case 'text':
        return (
          <IonInput
            value={field.label}
            placeholder="Etiqueta del campo"
            onIonChange={(event) =>
              handleFieldLabelChange(field.id, event.detail.value!)
            }
          />
        );
      case 'textarea':
        return (
          <IonInput
            value={field.label}
            placeholder="Etiqueta del campo"
            onIonChange={(event) =>
              handleFieldLabelChange(field.id, event.detail.value!)
            }
          />
        );
      case 'checkbox':
        return (
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Etiqueta del campo</IonLabel>
              <IonInput
                value={field.label}
                placeholder="Etiqueta del campo"
                onIonChange={(event) =>
                  handleFieldLabelChange(field.id, event.detail.value!)
                }
              />
            </IonItem>

            {field.options?.map((option, index) => (
              <IonItem key={index}>
                <IonInput
                  value={option}
                  placeholder={`Opción ${index + 1}`}
                  onIonChange={(event) =>
                    handleCheckboxOptionChange(
                      field.id,
                      index,
                      event.detail.value!
                    )
                  }
                />
                <IonButton
                  type="button"
                  size="small"
                  fill="outline"
                  onClick={() => handleRemoveOption(field.id, index)}
                >
                  -
                </IonButton>
              </IonItem>
            ))}

            <IonButton
              type="button"
              size="small"
              fill="outline"
              onClick={() => handleAddOption(field.id)}
            >
              Agregar Opción
            </IonButton>
          </IonList>
        );
      case 'datepicker':
        return (
          <IonItem>
            <IonLabel position="stacked">Etiqueta del campo</IonLabel>
            <IonInput
              value={field.label}
              placeholder="Etiqueta del campo"
              onIonChange={(event) =>
                handleFieldLabelChange(field.id, event.detail.value!)
              }
            />
            <IonDatetime
              displayFormat="DD/MM/YYYY"
              placeholder="Fecha"
              onIonChange={(event) =>
                handleFieldLabelChange(field.id, event.detail.value!)
              }
            />
          </IonItem>
        );
      default:
        return null;
    }
  };

  const saveForm = () => {
    const formData = {
      title: formTitle,
      fields,
    };

    // Convertir a JSON y hacer algo con los datos guardados
    const jsonFormData = JSON.stringify(formData);
    console.log(jsonFormData);
  };

    function deleteField(id: number): void {
        throw new Error('Function not implemented.');
    }

  return (
    <div>
      <h2>{formTitle}</h2>

      <IonItem>
        <IonLabel position="stacked">Título del formulario</IonLabel>
        <IonInput
          value={formTitle}
          placeholder="Título del formulario"
          onIonChange={handleTitleChange}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Tipo de campo</IonLabel>
        <IonSelect
          value={selectedFieldType}
          placeholder="Seleccionar tipo de campo"
          onIonChange={handleFieldTypeChange}
        >
          <IonSelectOption value="text">Texto Corto</IonSelectOption>
          <IonSelectOption value="textarea">Texto Largo</IonSelectOption>
          <IonSelectOption value="checkbox">Checkbox</IonSelectOption>
          <IonSelectOption value="datepicker">Datepicker</IonSelectOption>
        </IonSelect>
      </IonItem>

      {fields.map((field) => (
        <IonItem key={field.id}>
          {renderFieldInputs(field)}
          <IonButton
            type="button"
            color="danger"
            onClick={() => deleteField(field.id)}
          >
            Eliminar Campo
          </IonButton>
        </IonItem>
      ))}

      <IonButton expand="block" onClick={saveForm}>
        Guardar Formulario
      </IonButton>
    </div>
  );
};

export default FormBuilder;
