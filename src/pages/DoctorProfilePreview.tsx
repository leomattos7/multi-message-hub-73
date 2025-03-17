
import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicPage } from '@/components/DoctorProfile/PublicPage';

const DoctorProfilePreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Extract the doctor ID from the preview URL
  const doctorId = id?.replace('preview-', '');
  
  return (
    <div className="h-full">
      <PublicPage previewDoctorId={doctorId} />
    </div>
  );
};

export default DoctorProfilePreview;
