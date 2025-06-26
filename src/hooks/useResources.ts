import { APIFetchResponse, constructUrl } from "@hive/esm-core-api";
import { useDebouncedValue } from "@mantine/hooks";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Listing, Property, Resource } from "../types";

const propertyToResource = (property: Property): Resource => ({
  id: property.id,
  name: property.name,
});
const listingToResource = (listing: Listing): Resource => ({
  id: listing.id,
  name: listing.title,
});

export const useResources = (model?: string) => {
  const [search, setSearch] = useState<string>();
  const [debounced] = useDebouncedValue(search, 500);
  const url = useMemo(() => {
    if (model === "Property")
      return constructUrl("/properties", {
        search: debounced,
        
        // v: "custom:include(user)",
      });
    if (model === "Listing")
      return constructUrl("/listings", {
        search: debounced,
        // v: "custom:include(user)",
      });
    return null;
  }, [model, debounced]);
  const { data, error, isLoading } = useSWR<
    APIFetchResponse<{ results: Array<Property | Listing> }>
  >(debounced ? url : undefined);
  return {
    resources: (data?.data?.results ?? []).map((item) => {
      if (model === "Property") return propertyToResource(item as Property);
      if (model === "Listing") return listingToResource(item as Listing);
      return null;
    }),
    isLoading,
    error,
    searchResources: setSearch,
    resourcesSearchValue: search,
  };
};
