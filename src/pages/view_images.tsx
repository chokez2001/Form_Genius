import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonModal, IonImg } from '@ionic/react';
import { Filesystem, Directory, ReadFileResult } from '@capacitor/filesystem';
import './view_images.css'


const ViewImagesPage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const result = await Filesystem.readdir({
        path: "", 
        directory: Directory.Data,
      });

      // Leer el contenido de cada imagen y agregarlo al estado de las imágenes
      const imageContents = await Promise.all(
        result.files.map(async (imageName) => {
          const file = await Filesystem.readFile({
            path: `/${imageName.name}`, // Cambia la ruta según la ubicación donde se guardan las imágenes
            directory: Directory.Data,
          });
          return file.data;
        })
      );

      setImages(imageContents);
    } catch (error) {
      console.error('Error al cargar las imágenes:', error);
    }
  };

  const handleImageClick = (imageData: string) => {
    setSelectedImage(imageData);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const rows = Math.ceil(images.length / 3);

  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Galería de Imágenes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonGrid className="image-grid">
          {[...Array(rows)].map((_, rowIndex) => (
            <IonRow key={rowIndex} className="image-row">
              {[...Array(3)].map((_, colIndex) => {
                const imageIndex = rowIndex * 3 + colIndex;
                if (imageIndex < images.length) {
                  const imageData = images[imageIndex];
                  return (
                    <IonCol key={colIndex} size="4" className="image-col">
                      <div className="grid-image-container" onClick={() => handleImageClick(imageData)}>
                        <IonImg
                          src={`data:image/jpeg;base64,${imageData}`}
                          alt={`Imagen ${imageIndex}`}
                          className="grid-image"
                        />
                      </div>
                    </IonCol>
                  );
                } else {
                  return <IonCol key={colIndex} size="4"></IonCol>;
                }
              })}
            </IonRow>
          ))}
        </IonGrid>
      </IonContent>
      <IonModal isOpen={!!selectedImage} onDidDismiss={handleCloseModal} className="image-modal">
        <div className="modal-image-container">
          <IonImg src={`data:image/jpeg;base64,${selectedImage}`} className="modal-image" />
        </div>
      </IonModal>
    </IonPage>
  );
};

export default ViewImagesPage;
