'use client';
import React from 'react';

export default function Block() {
  return (
    <div className="flex flex-col mt-10 ml-5 mr-5 defaulttext">
      <h1 className="text-3xl font-semibold mb-3">No Access</h1>
      <p className="mb-2 text-lg">
        Your plan does not give you access to this feature.{' '}
        <a
          href="/main/pricing"
          className="text-blue-600 hover:underline"
        >
          Learn more here.
        </a>
      </p>
    </div>
  );
}
