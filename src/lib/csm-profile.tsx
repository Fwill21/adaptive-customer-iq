/* Client access to the stored CSM profile, so the person shown in the rail,
 * the notification behaviour and the workspace defaults come from records. */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { DEFAULT_CSM_SLUG, getCsmProfile, type CsmProfile } from "./csm-profile.functions";
import { MAYA } from "./northstar-data";

export const CSM_PROFILE_QUERY_KEY = ["csm-profile"] as const;

/** The stored profile, or null while it loads. */
export function useCsmProfile(slug: string = DEFAULT_CSM_SLUG): CsmProfile | null {
  const fetchProfile = useServerFn(getCsmProfile);
  const { data } = useQuery({
    queryKey: [...CSM_PROFILE_QUERY_KEY, slug],
    queryFn: () => fetchProfile({ data: { slug } }),
    staleTime: 5 * 60_000,
  });
  return data ?? null;
}

/** The person object the LUX rail renders, backed by the profile record. */
export function useCsmPerson(): { name: string; role: string } {
  const profile = useCsmProfile();
  return useMemo(
    () =>
      profile
        ? { name: profile.name, role: profile.roleTitle }
        : { name: MAYA.name, role: MAYA.role },
    [profile],
  );
}
