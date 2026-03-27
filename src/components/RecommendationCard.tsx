import { ExternalLink } from 'lucide-react';
import { Service } from '../lib/services';

interface RecommendationCardProps {
  service: Service;
  reason: string;
}

export function RecommendationCard({ service, reason }: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-3xl mt-1">{service.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-sm truncate">{service.name}</h3>
              {service.badge && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap">
                  {service.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2">{service.category}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
      <p className="text-xs text-blue-600 font-medium mb-4 bg-blue-50 p-2 rounded-lg">{reason}</p>

      <div className="flex gap-2">
        <a
          href={service.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          Explore
          <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
