using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using PSPDFKitFoundation;
using PSPDFKitFoundation.Search;

namespace ReactNativePSPDFKit
{
    static class JsonUtils
    {
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
