import {configureStore} from '@reduxjs/toolkit';
import mainReducer from './Slice';

export default configureStore({
  reducer: {
    globalStore: mainReducer,
  },
});
