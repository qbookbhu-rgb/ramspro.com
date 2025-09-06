
"use client";

import React, { Children, isValidElement, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Loader2 } from "lucide-react";

interface MapProps extends google.maps.MapOptions {
  className?: string;
  style?: { [key: string]: string };
}

export const Map: React.FC<MapProps> = ({
  className,
  style,
  children,
  ...options
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);
  
  if (map) {
      map.setOptions(options);
  }

  return (
    <>
      <div ref={ref} style={style} className={className} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};


const render = (status: Status) => {
    switch (status) {
        case Status.LOADING:
            return <div className="h-full w-full flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
        case Status.FAILURE:
            return <div>Error loading maps.</div>;
        case Status.SUCCESS:
            return <></>;
    }
};

const MapWrapper: React.FC<MapProps> = (props) => {
    return (
        <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} render={render}>
            <Map {...props} />
        </Wrapper>
    )
}

export { MapWrapper as Map };

