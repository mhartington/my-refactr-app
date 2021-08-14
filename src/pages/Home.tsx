import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButton,
  IonButtons,
  IonIcon,
  useIonAlert,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useState, useRef, useEffect } from 'react';
import './Home.css';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const Home: React.FC = () => {
  const [state, setState] = useState<string[]>([]);
  const [presentAlert] = useIonAlert();
  const itemSliding = useRef<HTMLIonListElement | null>(null);

  useEffect(() => {
    console.log('in useEffect');
    checkPermission().then(mkDir).then(readDir);
  }, []);

  const checkPermission = async () => {
    await Filesystem.requestPermissions();
  };
  const mkDir = async () => {
    try {
      await Filesystem.mkdir({
        directory: Directory.Documents,
        path: 'new-notes',
      });
    } catch (e) {}
  };
  const readDir = async () => {
    const items = await Filesystem.readdir({
      directory: Directory.Documents,
      path: 'new-notes',
    });
    setState(items.files.reverse());
  };

  const addNewItem = () => {
    presentAlert({
      header: 'Add New file',
      message: 'Create a new Text File',
      inputs: [
        { type: 'text', name: 'fileName', label: 'Name' },
        { type: 'textarea', name: 'fileContent', label: 'Content' },
      ],
      buttons: ['Save'],
      onDidDismiss: async (ev) => {
        const { fileName, fileContent } = ev.detail.data.values;
        await Filesystem.writeFile({
          directory: Directory.Documents,
          path: `new-notes/${fileName}.txt`,
          encoding: Encoding.UTF8,
          data: fileContent ?? '',
        });
        await readDir();
        // setState([...state, {name: newItem, id: ++state.length - 1}])
      },
    });
  };
  const edit = async (fileName: string) => {
    const { data } = await Filesystem.readFile({
      directory: Directory.Documents,
      path: `new-notes/${fileName}`,
      encoding: Encoding.UTF8
    });

    presentAlert({
      header: 'Add New file',
      message: 'Create a new Text File',
      inputs: [
        { type: 'text', name: 'fileName', label: 'Name', value: fileName },
        {
          type: 'textarea',
          name: 'fileContent',
          label: 'Content',
          value: data,
        },
      ],
      buttons: ['Save'],
      onDidDismiss: async (ev) => {
        const { fileName, fileContent } = ev.detail.data.values;
        await Filesystem.writeFile({
          directory: Directory.Documents,
          path: `new-notes/${fileName}`,
          encoding: Encoding.UTF8,
          data: fileContent ?? '',
        });
        await readDir();
        await itemSliding.current?.closeSlidingItems();
      },
    });
  };
  const deleteItem = async (fileName: string) => {
    await itemSliding.current?.closeSlidingItems();
    await Filesystem.deleteFile({
      directory: Directory.Documents,
      path: `new-notes/${fileName}`,
    });
    await readDir();
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>File Explorer</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => addNewItem()}>
              <IonIcon icon={add} slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">File Explorer</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList ref={itemSliding}>
          {state.map((entry, idx) => {
            return (
              <IonItemSliding key={idx}>
                <IonItem>
                  <p slot="start">{idx}</p>
                  {entry}
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="success" onClick={() => edit(entry)}>
                    Edit
                  </IonItemOption>
                  <IonItemOption
                    color="danger"
                    onClick={() => deleteItem(entry)}
                  >
                    Delete
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
