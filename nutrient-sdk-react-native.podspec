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
  s.source_files      = "ios/*.{xcodeproj}", "ios/RCTPSPDFKit/*.{h,m,swift}", "ios/RCTPSPDFKit/Converters/*.{h,m,swift}", "ios/RCTPSPDFKit/Helpers/*.{h,m,swift}"
  s.dependency("React")
  s.dependency("PSPDFKit", "14.12.0")
  s.dependency("Instant", "14.12.0")
  s.frameworks = "UIKit"
end
