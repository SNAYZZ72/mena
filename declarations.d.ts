// This file is intentionally left empty to allow TypeScript to pick up proper types from installed Expo packages.

// Removing ambient stubs for Expo modules
// declare module 'expo-camera';
// declare module 'expo-image-picker'; 

// Ambient module declarations for Expo modules

declare module 'expo-camera' {
  import React from 'react';

  export enum CameraType {
    front = 'front',
    back = 'back',
  }

  export class Camera extends React.Component<any> {
    static Constants: {
      Type: typeof CameraType;
      VideoQuality?: any;
    };
    static requestCameraPermissionsAsync(): Promise<{ status: string }>;
    static getCameraPermissionsAsync(): Promise<{ status: string }>;
    takePictureAsync(options?: { quality?: number }): Promise<{ uri: string }>;
  }

  export namespace FaceDetector {
    export namespace Constants {
      export enum Mode { fast = 0, accurate = 1 }
      export enum Landmarks { none = 0, all = 1 }
      export enum Classifications { none = 0, all = 1 }
    }
  }

  export interface FaceData { rollAngle?: number }
  export interface FaceDetectionResult { faces: FaceData[] }
}

declare module 'expo-image-picker' {
  export enum MediaTypeOptions {
    All = 'All',
    Videos = 'Videos',
    Images = 'Images',
  }
  export interface ImagePickerAsset {
    uri: string;
    // other fields omitted
  }
  export interface ImagePickerSuccessResult {
    canceled: boolean;
    assets: ImagePickerAsset[];
  }
  export type ImagePickerResult = ImagePickerSuccessResult;

  export function requestMediaLibraryPermissionsAsync(): Promise<{ status: string }>;
  export function launchImageLibraryAsync(options: any): Promise<ImagePickerResult>;
  export function launchCameraAsync(options: any): Promise<ImagePickerResult>;
} 