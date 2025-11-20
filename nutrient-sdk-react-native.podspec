# frozen_string_literal: true

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name              = "nutrient-sdk-react-native"
  s.version           = package["version"]
  s.summary           = "Nutrient React Native SDK"
  s.documentation_url = "https://nutrient.io/guides/react-native"
  s.license           = package["license"]
  s.description       = <<-DESC
                        A high-performance viewer, extensive annotation and document editing tools, digital signatures, and more.
  DESC
  s.authors           = { "PSPDFKit GmbH d/b/a Nutrient" => "support@nutrient.io" }
  s.homepage          = "https://nutrient.io/guides/react-native/"
  s.platform          = :ios, "16.0"
  s.module_name       = "PSPDFKitReactNativeiOS"
  s.source            = { git: "https://github.com/PSPDFKit/react-native" }

  # Include all source files
  s.source_files      = "ios/*.{xcodeproj}", "ios/**/*.{h,m,swift,mm}"

  # Don't expose Fabric C++ headers publicly to prevent compilation conflicts
  s.project_header_files = "ios/Fabric/**/*.h"

  # Call install_modules_dependencies to set up C++ environment
  if !defined?(install_modules_dependencies).nil?
    install_modules_dependencies(s)
  else
    s.dependency("React")
  end

  s.dependency("PSPDFKit", "26.2.0")
  s.dependency("Instant", "26.2.0")
  s.frameworks = "UIKit"
end
