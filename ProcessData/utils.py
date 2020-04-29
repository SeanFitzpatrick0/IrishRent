def replace_item_in_dict(obj, to_replace, replace_with):
    """ Recursively DFS traverses through a dict and replaces all occurrences of a value """
    for k, v in obj.items():
        if v == to_replace:
            obj[k] = replace_with
        elif isinstance(v, dict):
            replace_item_in_dict(v, to_replace, replace_with)
    return obj
