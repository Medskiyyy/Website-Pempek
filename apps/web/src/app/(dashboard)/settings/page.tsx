import React from "react";
import { dbSettings } from "@pempek-ceklis/lib";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const settings = await dbSettings.get();
  return <SettingsClient initialSettings={settings} />;
}
