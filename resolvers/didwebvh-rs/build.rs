//! Emit `DIDWEBVH_RS_DECLARED_VERSION` from the `didwebvh-rs` dependency in `Cargo.toml`
//! (the `version = "…"` requirement in an inline table, or a plain `= "…"` dependency).

use std::env;
use std::fs;
use std::path::Path;

fn main() {
    let manifest_dir = env::var("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR");
    let toml_path = Path::new(&manifest_dir).join("Cargo.toml");
    println!("cargo:rerun-if-changed={}", toml_path.display());

    let toml = fs::read_to_string(&toml_path).expect("read Cargo.toml");
    let ver = didwebvh_rs_version_req(&toml).unwrap_or_else(|| "unknown".to_string());
    println!("cargo:rustc-env=DIDWEBVH_RS_DECLARED_VERSION={ver}");
}

fn didwebvh_rs_version_req(toml: &str) -> Option<String> {
    for raw_line in toml.lines() {
        let line = raw_line.split('#').next().unwrap_or("").trim();
        if !line.starts_with("didwebvh-rs") {
            continue;
        }
        if let Some(idx) = line.find("version = \"") {
            let sub = &line[idx + "version = \"".len()..];
            return sub.split('"').next().map(String::from);
        }
        let after = line.strip_prefix("didwebvh-rs")?.trim_start().strip_prefix('=')?.trim_start();
        if let Some(rest) = after.strip_prefix('"') {
            return rest.split('"').next().map(String::from);
        }
    }
    None
}
