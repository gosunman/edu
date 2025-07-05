'use client';

import { useState, useEffect } from 'react';
import { FavoriteItem } from '@/types';

const FAVORITES_KEY = 'user_favorites';

// 로컬 스토리지에서 즐겨찾기 가져오기
export const getFavorites = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      const favorites = JSON.parse(stored);
      // Date 객체로 변환
      return favorites.map((fav: any) => ({
        ...fav,
        addedAt: new Date(fav.addedAt)
      }));
    }
  } catch (error) {
    console.error('즐겨찾기 로드 중 오류:', error);
  }
  
  return [];
};

// 로컬 스토리지에 즐겨찾기 저장하기
export const saveFavorites = (favorites: FavoriteItem[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('즐겨찾기 저장 중 오류:', error);
  }
};

// 즐겨찾기 추가
export const addToFavorites = (item: Omit<FavoriteItem, 'addedAt'>): boolean => {
  const favorites = getFavorites();
  
  // 이미 존재하는지 확인
  const exists = favorites.some(fav => fav.id === item.id && fav.type === item.type);
  if (exists) return false;
  
  const newFavorite: FavoriteItem = {
    ...item,
    addedAt: new Date()
  };
  
  favorites.push(newFavorite);
  saveFavorites(favorites);
  return true;
};

// 즐겨찾기 제거
export const removeFromFavorites = (id: string, type: 'flashcard' | 'simulation'): boolean => {
  const favorites = getFavorites();
  const initialLength = favorites.length;
  
  const filtered = favorites.filter(fav => !(fav.id === id && fav.type === type));
  
  if (filtered.length !== initialLength) {
    saveFavorites(filtered);
    return true;
  }
  
  return false;
};

// 즐겨찾기 확인
export const isFavorite = (id: string, type: 'flashcard' | 'simulation'): boolean => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === id && fav.type === type);
};

// 즐겨찾기 훅
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const addFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    const success = addToFavorites(item);
    if (success) {
      setFavorites(getFavorites());
    }
    return success;
  };

  const removeFavorite = (id: string, type: 'flashcard' | 'simulation') => {
    const success = removeFromFavorites(id, type);
    if (success) {
      setFavorites(getFavorites());
    }
    return success;
  };

  const checkFavorite = (id: string, type: 'flashcard' | 'simulation') => {
    return isFavorite(id, type);
  };

  const getFavoritesByType = (type: 'flashcard' | 'simulation') => {
    return favorites.filter(fav => fav.type === type);
  };

  const getFavoritesByCategory = (category: string) => {
    return favorites.filter(fav => fav.category === category);
  };

  const getFavoritesBySubject = (subject: string) => {
    return favorites.filter(fav => fav.subject === subject);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
    getFavoritesByType,
    getFavoritesByCategory,
    getFavoritesBySubject
  };
}; 