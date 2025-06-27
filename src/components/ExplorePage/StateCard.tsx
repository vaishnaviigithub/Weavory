"use client";
import React from 'react';
import Image from 'next/image';
import { Users, ChevronRight } from 'lucide-react';

interface StateCardProps {
  state: any;
  toggleState: (name: string) => void;
}

const StateCard = ({ state, toggleState }: StateCardProps) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => toggleState(state.name)}
    >
      <div className="relative h-48">
        <Image
          src={state.image}
          alt={`${state.name} handloom`}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h4 className="text-2xl font-bold">{state.name}</h4>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              {state.categories.reduce((acc: number, cat: any) => acc + cat.weaverCount, 0).toLocaleString()} artisans
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-orange-500 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default StateCard;