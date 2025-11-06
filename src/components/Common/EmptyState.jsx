import React from 'react';

export default function EmptyState({ icon: Icon, title, description }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Icon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {title}
            </h3>
            <p className="text-gray-500">
                {description}
            </p>
        </div>
    );
}