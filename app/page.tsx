import { redirect } from 'next/navigation';
import UserStats from '../components/dashboard/UserStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import MotivationCard from '../components/dashboard/MotivationCard';
import HealthMetricsChart from '../components/dashboard/HealthMetricsChart';
import VoiceInput from '../components/ui/VoiceInput';

export default function RootPage() {
  // Here in a real app, we would check if the user is authenticated
  // For demo purposes, we'll redirect to the dashboard
  redirect('/dashboard');
  
  // This won't be rendered
  return null;
}
