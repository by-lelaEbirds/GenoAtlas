import React from 'react';

function AvatarSvg({ children, size = 40, className = '', viewBox = '0 0 64 64' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

function PinAvatar({ size, className }) {
  return (
    <AvatarSvg size={size} className={className}>
      <path d="M32 9C24 9 18 15.4 18 23.4C18 34.4 32 51 32 51C32 51 46 34.4 46 23.4C46 15.4 40 9 32 9Z" fill="currentColor" />
      <circle cx="32" cy="24" r="7.5" fill="white" fillOpacity="0.95" />
      <circle cx="32" cy="24" r="4" fill="currentColor" fillOpacity="0.9" />
    </AvatarSvg>
  );
}

function PlaneAvatar({ size, className }) {
  return (
    <AvatarSvg size={size} className={className}>
      <path
        d="M10 31.5L53 12L41.2 52L31.5 36.8L10 31.5Z"
        fill="currentColor"
        fillOpacity="0.94"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M31 36L53 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.9" />
    </AvatarSvg>
  );
}

function BalloonAvatar({ size, className }) {
  return (
    <AvatarSvg size={size} className={className}>
      <path d="M32 10C22 10 15 17.6 15 27.4C15 36.6 21.7 42.8 28.3 46.4L26 52H38L35.7 46.4C42.3 42.8 49 36.6 49 27.4C49 17.6 42 10 32 10Z" fill="currentColor" fillOpacity="0.92" />
      <path d="M26 52H38L35.5 57H28.5L26 52Z" fill="currentColor" />
      <path d="M24.5 43.5L28.5 52M39.5 43.5L35.5 52" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeOpacity="0.92" />
      <path d="M24 25C24 20.6 27.6 17 32 17" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.9" />
    </AvatarSvg>
  );
}

function HelicopterAvatar({ size, className }) {
  return (
    <AvatarSvg size={size} className={className}>
      <path d="M18 30C18 24 22.8 19 28.8 19H40C44.4 19 48 22.6 48 27V34H18V30Z" fill="currentColor" fillOpacity="0.94" />
      <rect x="48" y="27" width="8" height="3.5" rx="1.75" fill="currentColor" />
      <path d="M32 19V14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 14H46" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 38H46" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 38H24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="27.5" cy="27.5" r="4.8" fill="white" fillOpacity="0.95" />
      <path d="M22 34L20 41H46L44 34" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </AvatarSvg>
  );
}

function UfoAvatar({ size, className }) {
  return (
    <AvatarSvg size={size} className={className}>
      <ellipse cx="32" cy="37" rx="22" ry="10" fill="currentColor" fillOpacity="0.94" />
      <path d="M20 34C20 25.5 25.4 19 32 19C38.6 19 44 25.5 44 34" fill="currentColor" />
      <circle cx="32" cy="28.5" r="6.5" fill="white" fillOpacity="0.95" />
      <circle cx="22" cy="38" r="2.2" fill="#FACC15" />
      <circle cx="32" cy="41" r="2.2" fill="#34D399" />
      <circle cx="42" cy="38" r="2.2" fill="#FB7185" />
      <path d="M28 28.5C28 26 29.8 24 32 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
    </AvatarSvg>
  );
}

function RocketAvatar({ size, className }) {
  return (
    <AvatarSvg size={size} className={className}>
      <path d="M39 12C30 14 22 22 20 31L14 37L19.5 39.5L22 45L28 39C37 37 45 29 47 20C47.8 16.4 46.6 13.2 45 11.5C43.3 10 40.6 10.8 39 12Z" fill="currentColor" fillOpacity="0.95" />
      <path d="M20 31L28 39" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.95" />
      <circle cx="35" cy="24" r="5.3" fill="white" fillOpacity="0.95" />
      <path d="M17 42L12 50L20 47L17 42Z" fill="currentColor" />
      <path d="M21.5 46.5L18 54" stroke="#FB923C" strokeWidth="2.4" strokeLinecap="round" />
    </AvatarSvg>
  );
}

export default function AvatarIcon({ avatar, size = 40, className = '' }) {
  if (avatar?.image) {
    return (
      <img
        aria-hidden="true"
        src={avatar.image}
        alt={avatar.name || 'Avatar'}
        width={size}
        height={size}
        className={className}
        style={{ width: `${size}px`, height: `${size}px`, objectFit: 'cover', borderRadius: '26px' }}
      />
    );
  }
  switch (avatar?.id) {
    case 'pin':
      return <PinAvatar size={size} className={className} />;
    case 'plane':
      return <PlaneAvatar size={size} className={className} />;
    case 'balloon':
      return <BalloonAvatar size={size} className={className} />;
    case 'heli':
      return <HelicopterAvatar size={size} className={className} />;
    case 'ufo':
      return <UfoAvatar size={size} className={className} />;
    case 'rocket':
      return <RocketAvatar size={size} className={className} />;
    default:
      return (
        <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1 }}>
          {avatar?.icon || '*'}
        </span>
      );
  }
}
