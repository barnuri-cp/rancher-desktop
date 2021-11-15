import { ImageProcessor } from '@/k8s-engine/images/imageProcessor';
import NerdctlImageProcessor from '@/k8s-engine/images/nerdctlImageProcessor';
import MobyImageProcessor from '@/k8s-engine/images/mobyImageProcessor';
import { ContainerEngine } from '@/config/settings';
import * as K8s from '@/k8s-engine/k8s';

const cachedImageProcessors: Partial<Record<ContainerEngine, ImageProcessor|null>> = { };

/**
 * @param engineName: one of the values from the settings.ContainerEngine enum
 * @param k8sManager
 */
export function createImageProcessor(engineName: ContainerEngine, k8sManager: K8s.KubernetesBackend): ImageProcessor {
  if (!(engineName in cachedImageProcessors)) {
    cachedImageProcessors[engineName] = createImageProcessorFromEngineName(engineName, k8sManager);
  }
  if (!cachedImageProcessors[engineName]) {
    throw new Error(`No image processor called ${ engineName }`);
  }

  return cachedImageProcessors[engineName] as ImageProcessor;
}

export function createImageProcessorFromEngineName(engineName: ContainerEngine, k8sManager: K8s.KubernetesBackend): ImageProcessor|null {
  switch (engineName) {
  case ContainerEngine.MOBY:
    return new MobyImageProcessor(k8sManager, engineName);
  case ContainerEngine.CONTAINERD:
    return new NerdctlImageProcessor(k8sManager, engineName);
  }

  return null;
}
