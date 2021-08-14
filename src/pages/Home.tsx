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
  IonItemSliding, IonItemOption, IonItemOptions
} from '@ionic/react';
import { add } from 'ionicons/icons'
import { useState, useRef } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const [state, setState] = useState([{ name: 'item', id: 0 }]);
  const [presentAlert] = useIonAlert();
  const itemSliding = useRef<HTMLIonListElement | null>(null);
  const addNewItem = () => {
    presentAlert({
      header: "Add New Item",
      message: 'Create a new item for your list',
      inputs: [{ type: 'text', name: 'newItem', label: 'new item'}],
      buttons: ['Save'],
      onDidDismiss: (ev)=> {
        const newItem = ev.detail.data.values.newItem;
        setState([...state, {name: newItem, id: ++state.length - 1}])
      },
    })
  }

  const deleteItem = (item: {name: string, id: number}) => {
      const newState = state.filter(entry => {
        if(entry.id === item.id){}
        else {return entry}
      })
      return itemSliding.current?.closeSlidingItems().then(() => {
        setState(newState)
      })
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonTitle>Blank</IonTitle>
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
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList ref={itemSliding}>
          {state.map((entry) => {
            return (
              <IonItemSliding>
                <IonItem>
                  <p slot="start">{entry.id}</p>
                  {entry.name}
                  </IonItem>
                  <IonItemOptions side="end">
                  <IonItemOption onClick={() => deleteItem(entry)}>Delete</IonItemOption>
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
