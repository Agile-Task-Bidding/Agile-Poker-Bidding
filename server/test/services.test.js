const admin = require('firebase-admin');
const UserService = require('../services/user');
const AuthService = require('../services/auth');

require('dotenv').config();

const serviceAccount = require('../config/firebase-credential.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
})

test('get account', async () => {
  const falcinspireUid = 'dO0jGkHEwJUZTqYK0TMT4xIH5213';
  const user = await UserService.getUser(falcinspireUid);
  expect(user.username).toBe('falcinspire');
});

test('create account', async () => {
  const uid = await UserService.createUser('unittestauto', 'unittestauto@gmail.com', 'password');
  const user = await UserService.getUser(uid);
  expect(user.username).toBe('unittestauto');
  await UserService.deleteUser(uid);
  try {
    await UserService.getUser(uid);
    throw new Error('User resolved');
  } catch (err) {
    expect(err.name).toBe('apb/user/not-found');
  }
  expect(async () => {
    await UserService.getUser(uid);
  }).rejects.toThrow('User not found');
});

test('throw on nonexistent account', async () => {
  try {
    await UserService.getUser('AAAAAAAAAAAAAAAAA');
    throw new Error('User resolved');
  } catch (err) {
    expect(err.name).toBe('apb/user/not-found');
  }
});

test('throw on duplicate username', async () => {
  try {
    await UserService.createUser('falcinspire', 'falcinspire@gmail.com', 'password');
    throw new Error('User registered');
  } catch (err) {
    expect(err.name).toBe('apb/user/username-taken');
  }
});

test('update room config', async () => {

  const roomConfigMatch = (room1, room2) => {
    if (room1.allowAbstain != room2.allowAbstain) return false;
    if (room1.deck.length != room2.deck.length) return false;
    const values = room1.deck.map(it => it.value);
    for (const value of values) {
      const card1 = room1.deck.find(it => it.value === value);
      const card2 = room2.deck.find(it => it.value === value);
      if (!card1 || !card2) return false;
      if (card1.tag != card2.tag) return false;
    }
    return true;
  }

  const unittestUid = 'MjgnkkLZyMRhXO6RO1IPAnq4XiE2';
  let roomConfig = {
    allowAbstain: true,
    deck: [
      { value: 1, tag: 'ez' },
      { value: 2, tag: 'md' },
      { value: 3, tag: 'hd' },
    ]
  };
  await UserService.updateRoomConfig(unittestUid, roomConfig);
  const download = (await UserService.getUser(unittestUid)).roomConfig;
  expect(roomConfigMatch(roomConfig, download)).toBe(true);
  
  // reload different data for next time
  roomConfig = {
    allowAbstain: false,
    deck: [
      { value: 10, tag: 'ezez' },
      { value: 21, tag: 'mded' },
      { value: 32, tag: 'hdhd' },
    ]
  };
  await UserService.updateRoomConfig(unittestUid, roomConfig);
});