import { cn } from '../../utils/helpers';

const Card = ({ title, children, actions, className = '', onClick }) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200', 
        className
      )}
      onClick={onClick}
    >
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50/50 to-transparent">
          {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
