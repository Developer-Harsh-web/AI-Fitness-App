import { CommunityGroups } from '../../../components/community/CommunityGroups';

export const metadata = {
  title: 'Community | AI Fitness Coach',
  description: 'Connect with like-minded fitness enthusiasts and join community groups.',
};

export default function CommunityPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-8">
        <CommunityGroups />
      </div>
    </div>
  );
} 