import { ReactNode } from 'react';

interface CreateNewSectionProps {
  href?: string;
  onClick?: () => void;
  labelText: string;
  className?: string;
  buttonClassName?: string;
  buttonText: ReactNode[];
}

export default function CreateNewSection({
  href,
  onClick,
  labelText,
  className = '',
  buttonClassName = '',
  buttonText,
}: CreateNewSectionProps) {
  const commonProps = {
    className: buttonClassName,
    title: labelText,
  };

  const content = (
    <>
      {buttonText.map((text, index) => (
        <span key={index}>{text}</span>
      ))}
    </>
  );

  return (
    <div className={`flex justify-center items-center ${className}`}>
      {onClick ? (
        <button {...commonProps} onClick={onClick} type='button'>
          {content}
        </button>
      ) : href ? (
        <a {...commonProps} href={href}>
          {content}
        </a>
      ) : null}
    </div>
  );
}
