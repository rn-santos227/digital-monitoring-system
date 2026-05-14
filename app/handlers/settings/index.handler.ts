interface FetchApplicationSettingsFromBackendOptions {
  initializeApplicationSettings: () => Promise<void>
}

export const fetchApplicationSettingsFromBackend = async ({
  initializeApplicationSettings,
}: FetchApplicationSettingsFromBackendOptions) => {
  await initializeApplicationSettings()
}
