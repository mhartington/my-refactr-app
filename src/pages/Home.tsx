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
} from '@ionic/react';
import { add } from 'ionicons/icons'
import { useState } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const [state, setState] = useState([{ name: 'item', id: 0 }]);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonTitle>Blank</IonTitle>
        <IonButtons slot="end">
        <IonButton onClick={() => setState([...state, {name: 'item', id: ++state.length}])}>
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
        <IonList>
          {state.map((entry) => {
            return (
              <IonItem>
                <p slot="start">{entry.id}</p>
                {entry.name}
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
