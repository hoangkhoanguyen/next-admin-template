"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ImagePickerDialog } from "./ImagePickerDialog";

export interface ImagePickerDialogState {
  open: boolean;
  fieldId?: string;
  onSelect?: (images: any) => void;
  multiple?: boolean;
  maxImages?: number;
  currentImagesCount?: number;
}

interface ImagePickerDialogContextProps {
  state: ImagePickerDialogState;
  openModal: (params: {
    fieldId: string;
    onSelect: (images: any) => void;
    multiple?: boolean;
    maxImages?: number;
    currentImagesCount?: number;
  }) => void;
  closeModal: () => void;
}

const ImagePickerDialogContext = createContext<
  ImagePickerDialogContextProps | undefined
>(undefined);

export const useImagePickerDialog = () => {
  const ctx = useContext(ImagePickerDialogContext);
  if (!ctx)
    throw new Error(
      "useImagePickerDialog must be used within ImagePickerDialogProvider"
    );
  return ctx;
};

export const ImagePickerDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState<ImagePickerDialogState>({ open: false });

  const openModal = ({
    fieldId,
    onSelect,
    multiple = false,
    maxImages,
    currentImagesCount = 0,
  }: {
    fieldId: string;
    onSelect: (images: any) => void;
    multiple?: boolean;
    maxImages?: number;
    currentImagesCount?: number;
  }) => {
    setState({
      open: true,
      fieldId,
      onSelect,
      multiple,
      maxImages,
      currentImagesCount,
    });
  };

  const closeModal = () => {
    setState({ open: false });
  };

  return (
    <ImagePickerDialogContext.Provider value={{ state, openModal, closeModal }}>
      {children}
      <ImagePickerDialog />
    </ImagePickerDialogContext.Provider>
  );
};
