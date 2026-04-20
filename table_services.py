import json
from table_builders import TABLE_BUILDERS

def inject_tables(script, group):

    for key, func in TABLE_BUILDERS.items():

        result = func(group)

        if isinstance(result, dict):

            # inject rows ke placeholder tabel
            script = script.replace(
                f"{{{key}}}",
                json.dumps(result.get("rows", []), ensure_ascii=False)
            )

            # 🔥 inject metadata (contoh: totalLuasWilayah)
            for meta_key, meta_val in result.items():
                if meta_key == "rows":
                    continue

                script = script.replace(
                    f"{{{meta_key}}}",
                    str(meta_val)
                )

        else:

            script = script.replace(
                f"{{{key}}}",
                json.dumps(result, ensure_ascii=False)
            )

    return script