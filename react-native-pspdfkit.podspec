require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "PSPDFKitReactNativeiOS"
  s.version      = package['version']
  s.summary      = "A React Native module for the PSPDFKit library."
  s.authors		 = ["PSPDFKit"]

  s.homepage     = "https://github.com/PSPDFKit/react-native#readme"
  s.license      = package['license']
  s.platform     = :ios, "9.0"
  s.module_name  = 'PSPDFKitReactNativeiOS'
  s.source       = { :git => "https://github.com/PSPDFKit/react-native", :branch => "rad/podspec" }
  s.source_files  = "ios/*.{xcodeproj}", "ios/RCTPSPDFKit/*.{h,m,swift}", "ios/RCTPSPDFKit/Converters/*.{h,m,swift}"

  s.dependency 'React'
  s.frameworks = 'UIKit'
  s.vendored_frameworks = '../../PSPDFKit/PSPDFKit.framework'
end
