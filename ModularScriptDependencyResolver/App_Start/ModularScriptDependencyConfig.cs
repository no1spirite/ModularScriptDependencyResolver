using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Optimization;
using BundleTransformer.Core.Bundles;
using BundleTransformer.Core.Transformers;

namespace ModularScriptDependencyResolver
{
    public class ModularScriptDependencyConfig
    {
        private static readonly Regex DependencyRegex = new Regex(@"///\s*<reference\s*path\s*=\s*""(?<path>.*)""\s*/>", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private static readonly Regex DependencyRegexAlt = new Regex(@"//\s*@reference\s*\s*/>", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public static void RegisterBundles(BundleCollection bundles, BundleOptions bundleOptions = null)
        {
            if (bundleOptions == null)
            {
                bundleOptions = new BundleOptions();
            }
            BundleTable.Bundles.Clear();
            BundleTable.Bundles.ResetAll();
            CreateLessBundles();
            CreateJsBundles(bundleOptions);
            //CreateScssBundles();
            //CreateCssBundles();
            
        }

        private static void CreateCssBundles()
        {
            var cssFiles = GetFiles("/Content/css/Views/", ".css");

            foreach (var source in cssFiles)
            {
                var bundlePath = "~/bundles/css/" + source.Name.Split('.')[0];
                var bundle = new StyleBundle(bundlePath);

                if (source.Directory != null)
                {
                    bundle.Include("~/Content/css/" + source.Directory.Name + "/" + source.Name);
                    bundle.Transforms.Add(new CssMinify());
                }

                BundleTable.Bundles.Add(bundle);
            }
        }

        private static void CreateLessBundles()
        {
            var cssFiles = GetFiles("/Content/css/Views/", ".less");

            foreach (var source in cssFiles)
            {
                var bundlePath = "~/bundles/css/" + source.Name.Split('.')[0];
                var bundle = new CustomStyleBundle(bundlePath);

                if (source.Directory != null)
                {
                    bundle.Include("~/Content/css/" + source.Directory.Name + "/" + source.Name);
                    bundle.Transforms.Add(new CssTransformer());
                    bundle.Transforms.Add(new CssMinify());
                }

                BundleTable.Bundles.Add(bundle);
            }
        }

        private static void CreateScssBundles()
        {
            var scssFiles = GetFiles("/Content/css/Views/", ".scss");

            foreach (var source in scssFiles)
            {
                var bundlePath = "~/bundles/css/" + source.Name.Split('.')[0];
                var bundle = new CustomStyleBundle(bundlePath);

                if (source.Directory != null)
                {
                    bundle.Include("~/Content/css/" + source.Directory.Name + "/" + source.Name);
                    bundle.Transforms.Add(new CssTransformer());
                    bundle.Transforms.Add(new CssMinify());
                }

                BundleTable.Bundles.Add(bundle);
            }
        }

        private static void CreateJsBundles(BundleOptions bundleOptions)
        {
            var jsFiles = GetFiles(bundleOptions.RelativeJsFolderPath ?? "/Scripts/Views/", ".js");

            foreach (var source in jsFiles)
            {
                var dependencies = GetDependencies(source);

                var bundlePath = "~/bundles/" + source.Name.Split('.')[0];
                var bundle = new Bundle(bundlePath);

                foreach (var dependency in dependencies.Distinct())
                {
                    bundle.Include(dependency);
                }

                if (source.Directory != null)
                {
                    bundle.Include((bundleOptions.RelativeJsFolderPath ?? "~/Scripts/Views/") + source.Directory.Name + "/" + source.Name);
                }

#if !DEBUG
                    bundle.Transforms.Add(new JsMinify());
#endif

                BundleTable.Bundles.Add(bundle);
            }

#if !DEBUG
                BundleTable.EnableOptimizations = true;
#endif
        }

        private static FileInfo GetFile(string path)
        {
/*            if (path[0] != '~')
            {
                return new FileInfo(path);
            }*/

            var applicationRoot = HttpContext.Current.Server.MapPath("~");
            return new FileInfo(applicationRoot + path.Remove(0, 1));
        }

        private static IEnumerable<FileInfo> GetFiles(string path, string fileExtension)
        {
/*
            if (path[0] != '~')
            {
                var directoryInfo = new DirectoryInfo(path);
                return directoryInfo.EnumerateFiles(
                "*" + fileExtension,
                SearchOption.AllDirectories);
            }*/

            var applicationRoot = HttpContext.Current.Server.MapPath("~");
            return Directory.EnumerateFiles(
                applicationRoot + path, "*" + fileExtension,
                SearchOption.AllDirectories).Where(file => true).Select(file => new FileInfo(file.ToLowerInvariant())).ToArray();
        }

        private static IEnumerable<string> GetMatches(Match match)
        {
            var dependencies = new List<string>();
            while (match.Success)
            {
                var path = match.Groups["path"].Value;
                dependencies.Add(path);

                match = match.NextMatch();
            }
            return dependencies;
        }

        private static IEnumerable<string> GetDependencies(FileSystemInfo file)
        {
            var script = File.ReadAllText(file.FullName);           
            var dependencies = new List<string>();
            var nestedDependencies = new List<string>();

            nestedDependencies.AddRange(GetMatches(DependencyRegex.Match(script)));
            nestedDependencies.AddRange(GetMatches(DependencyRegexAlt.Match(script)));

            foreach (var jsFile in nestedDependencies.Select(GetFile))
            {
                dependencies.AddRange(GetDependencies(jsFile));
            }

            dependencies.AddRange(nestedDependencies);

            return dependencies;
        }
    }

    public class BundleOptions
    {
        public string LessFolderPath { get; set; }
        public string CssFolderPath { get; set; }
        public string ScssFolderPath { get; set; }

        public string RelativeJsFolderPath { get; set; }
        public bool UseFolderNamesForBundle { get; set; }
    }
}