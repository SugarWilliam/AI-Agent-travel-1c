// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Camera, Heart, Eye, Clock } from 'lucide-react';

export function PhotoGuideCard({
  guide,
  onClick
}) {
  return <div onClick={onClick} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      <div className="relative h-40">
        <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
        {/* Duration Badge */}
        {guide.duration && <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {guide.duration}
          </div>}
        {/* Hot/New Badge */}
        {guide.isHot && <div className="absolute top-2 right-2 bg-[#FF6B6B] text-white text-xs px-2 py-1 rounded-full font-semibold">
            热门
          </div>}
        {guide.isNew && <div className="absolute top-2 right-2 bg-[#4ECDC4] text-white text-xs px-2 py-1 rounded-full font-semibold">
            新
          </div>}
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h4 className="font-bold text-[#2D3436] text-sm mb-1" style={{
        fontFamily: 'Nunito, sans-serif'
      }}>
          {guide.title}
        </h4>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2" style={{
        fontFamily: 'Quicksand, sans-serif'
      }}>
          {guide.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {guide.tags && guide.tags.slice(0, 2).map((tag, idx) => <span key={idx} className="text-xs bg-[#FFE66D]/30 text-[#2D3436] px-2 py-0.5 rounded-full">
              {tag}
            </span>)}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{guide.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{guide.views}</span>
            </div>
          </div>
          <span className="text-[#FF6B6B] font-semibold">
            {guide.category === 'video' ? '录像' : guide.category === 'outfit' ? '穿着' : '姿势'}
          </span>
        </div>
      </div>
    </div>;
}
export default PhotoGuideCard;