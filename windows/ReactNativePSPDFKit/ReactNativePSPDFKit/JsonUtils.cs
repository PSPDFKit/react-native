using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using PSPDFKit.Search;
using PSPDFKitFoundation;
using PSPDFKitFoundation.Search;
using PSPDFKitNative;

namespace ReactNativePSPDFKit
{
    static class JsonUtils
    {
        public static LibraryQuery ToLibraryQuery(JObject libraryQueryJson)
        {
            var libraryQuery = new LibraryQuery(libraryQueryJson.Value<string>("searchString"));

            if (libraryQueryJson.ContainsKey("excludeAnnotations"))
            {
                libraryQuery.ExcludeAnnotations = libraryQueryJson.Value<bool>("excludeAnnotations");
            }

            if (libraryQueryJson.ContainsKey("excludeDocumentText"))
            {
                libraryQuery.ExcludeDocumentText = libraryQueryJson.Value<bool>("excludeDocumentText");
            }

            if (libraryQueryJson.ContainsKey("matchExactPhrases"))
            {
                libraryQuery.MatchExactPhrases = libraryQueryJson.Value<bool>("matchExactPhrases");
            }

            if (libraryQueryJson.ContainsKey("maximumSearchResultsPerDocument"))
            {
                libraryQuery.MaximumSearchResultsPerDocument = libraryQueryJson.Value<int>("maximumSearchResultsPerDocument");
            }

            if (libraryQueryJson.ContainsKey("maximumSearchResultsTotal"))
            {
                libraryQuery.MaximumSearchResultsTotal = libraryQueryJson.Value<int>("maximumSearchResultsTotal");
            }


            if (libraryQueryJson.ContainsKey("maximumPreviewResultsPerDocument"))
            {
                libraryQuery.MaximumPreviewResultsPerDocument = libraryQueryJson.Value<int>("maximumPreviewResultsPerDocument");
            }

            if (libraryQueryJson.ContainsKey("maximumPreviewResultsTotal"))
            {
                libraryQuery.MaximumPreviewResultsTotal = libraryQueryJson.Value<int>("maximumPreviewResultsTotal");
            }

            if (libraryQueryJson.ContainsKey("generateTextPreviews"))
            {
                libraryQuery.GenerateTextPreviews = libraryQueryJson.Value<bool>("generateTextPreviews");
            }

            if (libraryQueryJson.ContainsKey("generateTextPreviews"))
            {
                libraryQuery.GenerateTextPreviews = libraryQueryJson.Value<bool>("generateTextPreviews");
            }

            if (libraryQueryJson.ContainsKey("previewRange"))
            {
                libraryQuery.PreviewRange = ToRange(libraryQueryJson.GetValue("previewRange"));
            }

            return libraryQuery;
        }

        internal static JToken PreviewResultsToJson(IEnumerable<LibraryPreviewResult> previewResults)
        {
            var previewResultsJson = new JArray();
            foreach (var documentQueryResult in previewResults)
            {
                var result = new JObject
                {
                    {"uid", documentQueryResult.Uid},
                    {"pageIndex", documentQueryResult.PageIndex},
                    {"previewText", documentQueryResult.PreviewText},
                    {"rangeInText", RangeToJson(documentQueryResult.RangeInText)},
                    {"rangeInPreviewText", RangeToJson(documentQueryResult.RangeInPreviewText)},
                    {"annotationId", documentQueryResult.AnnotationId}
                };

                previewResultsJson.Add(result);
            }

            return previewResultsJson;
        }

        internal static JToken SearchResultsToJson(IDictionary<string, LibraryQueryResult> queryResults)
        {
            var queryResultsJson = new JArray();
            foreach (var documentQueryResult in queryResults)
            {
                var result = new JObject
                {
                    {"uid", documentQueryResult.Key},
                    {"pageResults", LibraryQueryReultToJson(documentQueryResult.Value)}
                };


                queryResultsJson.Add(result);
            }

            return queryResultsJson;
        }

        private static JToken RangeToJson(IRange range)
        {
            return new JObject
            {
                { "position", range.Position},
                { "length", range.Length}
            };
        }

        private static IRange ToRange(JToken rangeJson)
        {
            return new Range(rangeJson.Value<int>("postion"), rangeJson.Value<int>("length"));
        }

        private static JArray LibraryQueryReultToJson(LibraryQueryResult libraryQueryResult)
        {
            var pageNumbersJson = new JArray();

            foreach (var pageNumber in libraryQueryResult.PageResults)
            {
                pageNumbersJson.Add(pageNumber);
            }

            return pageNumbersJson;
        }
    }
}
