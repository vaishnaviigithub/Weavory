"use client";
import React from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';

interface CategoryAccordionProps {
  states: any[];
  expandedState: string;
  toggleState: (name: string) => void;
  selectCategory: (stateIndex: number, categoryIndex: number) => void;
}

const CategoryAccordion = ({
  states,
  expandedState,
  toggleState,
  selectCategory
}: CategoryAccordionProps) => {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Browse All States</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {states.map((state, stateIndex) => (
          <div key={state.name} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
              onClick={() => toggleState(state.name)}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold mr-4">
                  {state.name.charAt(0)}
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{state.name}</h2>
              </div>
              {expandedState === state.name ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedState === state.name && (
              <div className="p-4 space-y-3 bg-gray-50 border-t border-gray-200">
                {state.categories.map((category: any, categoryIndex: number) => (
                  <div 
                    key={category.name}
                    onClick={() => selectCategory(stateIndex, categoryIndex)}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative mr-3">
                        <Image
                          src={category.featuredImage}
                          alt={category.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-3 w-3 mr-1" />
                          {category.weaverCount.toLocaleString()} artisans
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-orange-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryAccordion;