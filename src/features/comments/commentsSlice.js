import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as commentsAPI from '../../api/comments.api';
import toast from 'react-hot-toast';

// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ entityType, entityId }, { rejectWithValue }) => {
    try {
      const data = await commentsAPI.getComments(entityType, entityId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (commentData, { rejectWithValue }) => {
    try {
      const data = await commentsAPI.createComment(commentData);
      toast.success('Comment added successfully');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.data;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create comment
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload.data);
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
