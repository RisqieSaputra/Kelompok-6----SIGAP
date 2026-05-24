/**
 * Type declarations for SIGAP App
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'sigap';
  text: string;
  timestamp: string;
}

export interface PresetTopic {
  id: string;
  label: string;
  prompt: string;
  response: string;
  category: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  desc: string;
  bgColor: string; // e.g. 'bg-neo-blue', 'bg-neo-green', 'bg-neo-pink', etc.
  tag: string;
  presetTopicId: string;
}

export interface StatItem {
  id: string;
  figure: string;
  label: string;
  subtext: string;
  bgColor: string;
}

export interface RegionalGapData {
  region: string;
  percentage: number;
  barColor: string;
}

export interface TargetGroup {
  id: string;
  group: string;
  useCase: string;
  icon: string;
  bgColor: string;
}

export interface AduanSubmission {
  nama: string;
  provinsi: string;
  masalah: string;
}
