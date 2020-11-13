import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyBi7MZcD00iDBY5zJvLm43FQUHvT1AvXIQ',
  authDomain: 'agile-poker-bidding-71c12.firebaseapp.com',
  databaseURL: 'https://agile-poker-bidding-71c12.firebaseio.com',
  projectId: 'agile-poker-bidding-71c12',
  storageBucket: 'agile-poker-bidding-71c12.appspot.com',
  messagingSenderId: '135288113338',
  appId: '1:135288113338:web:1ef3ff6e9278098185da83',
  measurementId: 'G-31PCS71WRC',
}
firebase.initializeApp(config)
export const auth = firebase.auth
export const db = firebase.database()
