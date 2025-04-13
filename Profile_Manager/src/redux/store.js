import { createStore } from 'redux';
import { usersReducer } from './usersReducer';

export const store = createStore(usersReducer);
