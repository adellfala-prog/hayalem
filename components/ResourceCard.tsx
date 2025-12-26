
import React from 'react';
import { getIcon } from '../constants';
import { Resource } from '../types';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-start text-right">
      <div className="bg-blue-50 p-3 rounded-lg text-blue-600 mb-4">
        {getIcon(resource.icon)}
      </div>
      <h4 className="text-lg font-bold text-gray-800 mb-2">{resource.title}</h4>
      <p className="text-sm text-gray-600 mb-4 flex-1">
        {resource.description}
      </p>
      <a 
        href={resource.link} 
        target={resource.link.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1"
      >
        קרא עוד
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </a>
    </div>
  );
};

export default ResourceCard;
