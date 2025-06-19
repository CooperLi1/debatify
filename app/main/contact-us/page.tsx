'use client';
import React from 'react';

export default function ContactUs() {
  return (
    <div className="flex flex-col mt-10 ml-5 mr-5 defaulttext">
      <h1 className="text-3xl font-semibold mb-3">Contact Us</h1>
      <p className="mb-2 text-lg">
        For any questions, inquiries, or bugs reach out to:{' '}
        <a
          href="mailto:copperli1234@gmail.com"
          className="text-blue-600 hover:underline"
        >
          copperli1234@gmail.com 
        </a>
        {' '}and{' '}
        <a
          href="mailto:chrisytang2019@gmail.com"
          className="text-blue-600 hover:underline "
        >
            chrisytang2019@gmail.com 
        </a>
      </p>
    </div>
  );
}
