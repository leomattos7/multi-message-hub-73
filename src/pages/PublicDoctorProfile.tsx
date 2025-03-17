
import React, { useEffect } from 'react';
import { PublicPage } from '@/components/DoctorProfile/PublicPage';
import { useParams } from 'react-router-dom';

const PublicDoctorProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  useEffect(() => {
    // Log for debugging
    console.log('Loading doctor profile with slug:', slug);
  }, [slug]);
  
  return <PublicPage />;
};

export default PublicDoctorProfile;
